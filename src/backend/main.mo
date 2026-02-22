import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Roles and Access Control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type Shop = { name : Text };
  public type Item = { name : Text };

  public type UserProfile = {
    name : Text;
    preferredLocation : ?Text;
    defaultBudget : ?Nat;
  };

  public type Schedule = {
    id : Nat;
    owner : Principal;
    createdAt : Time.Time;
    location : Text;
    preferredDateTime : Time.Time;
    budget : Nat;
    items : [Item];
    selectedShop : ?Shop;
  };

  // Storage
  let schedules = Map.empty<Nat, Schedule>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userQuickBuyLists = Map.empty<Principal, [Item]>();
  var nextScheduleId = 0;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Helper Functions
  func toLocalScheduleId(globalId : Nat) : Nat {
    globalId % 1_000_000;
  };

  // Shopping Helper Features - Per User Quick Buy Lists
  public shared ({ caller }) func addQuickBuyItem(item : Item) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add quick buy items");
    };

    let currentList = switch (userQuickBuyLists.get(caller)) {
      case (?list) { list };
      case null { [] };
    };

    let newList = currentList.concat([item]);
    userQuickBuyLists.add(caller, newList);
  };

  public query ({ caller }) func getQuickBuyList() : async [Item] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view quick buy items");
    };

    switch (userQuickBuyLists.get(caller)) {
      case (?list) { list };
      case null { [] };
    };
  };

  public shared ({ caller }) func removeQuickBuyItem(itemIndex : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can remove quick buy items");
    };

    switch (userQuickBuyLists.get(caller)) {
      case (?list) {
        if (itemIndex < list.size()) {
          let newList = Array.tabulate(
            list.size() - 1,
            func(i) {
              if (i < itemIndex) { list[i] } else { list[i + 1] };
            }
          );
          userQuickBuyLists.add(caller, newList);
        };
      };
      case null { };
    };
  };

  public shared ({ caller }) func comparePrices(_item : Item, _shops : [Shop]) : async [Nat] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can compare prices");
    };
    [];
  };

  // Schedule Management - WITH OWNERSHIP VERIFICATION
  public shared ({ caller }) func saveSchedule(
    location : Text,
    preferredDateTime : Time.Time,
    budget : Nat,
    items : [Item],
    selectedShop : ?Shop
  ) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save schedules");
    };

    let id = nextScheduleId;
    nextScheduleId += 1;

    let schedule : Schedule = {
      id;
      owner = caller;
      createdAt = Time.now();
      location;
      preferredDateTime;
      budget;
      items;
      selectedShop;
    };

    schedules.add(toLocalScheduleId(id), schedule);
    toLocalScheduleId(id);
  };

  public query ({ caller }) func getSchedule(id : Nat) : async ?Schedule {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view schedules");
    };

    switch (schedules.get(toLocalScheduleId(id))) {
      case (?schedule) {
        // Verify ownership or admin access
        if (schedule.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own schedules");
        };
        ?schedule;
      };
      case null { null };
    };
  };

  public shared ({ caller }) func deleteSchedule(id : Nat) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete schedules");
    };

    switch (schedules.get(toLocalScheduleId(id))) {
      case (?schedule) {
        // Verify ownership or admin access
        if (schedule.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own schedules");
        };
        schedules.remove(toLocalScheduleId(id));
        true;
      };
      case null { false };
    };
  };

  public query ({ caller }) func listSchedules() : async [Schedule] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can list schedules");
    };

    // Return only caller's schedules (or all if admin)
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);

    schedules.values()
      .filter(func(schedule) { isAdmin or schedule.owner == caller })
      .toArray();
  };

  // Admin function to view all schedules
  public query ({ caller }) func listAllSchedules() : async [Schedule] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all schedules");
    };
    schedules.values().toArray();
  };

  // Demo Mode & Shop Discovery
  public query func getDemoShops() : async [Shop] {
    // Demo mode is available to everyone including anonymous users
    [{ name = "DemoShop" }];
  };

  public shared ({ caller }) func discoverShops(_location : Text) : async [Shop] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can discover shops");
    };
    [];
  };
};
