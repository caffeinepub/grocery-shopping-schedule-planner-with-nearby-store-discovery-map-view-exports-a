import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Schedule {
    id: bigint;
    owner: Principal;
    createdAt: Time;
    preferredDateTime: Time;
    items: Array<Item>;
    budget: bigint;
    selectedShop?: Shop;
    location: string;
}
export type Time = bigint;
export interface Shop {
    name: string;
}
export interface Item {
    name: string;
}
export interface UserProfile {
    name: string;
    preferredLocation?: string;
    defaultBudget?: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addQuickBuyItem(item: Item): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    comparePrices(_item: Item, _shops: Array<Shop>): Promise<Array<bigint>>;
    deleteSchedule(id: bigint): Promise<boolean>;
    discoverShops(_location: string): Promise<Array<Shop>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDemoShops(): Promise<Array<Shop>>;
    getQuickBuyList(): Promise<Array<Item>>;
    getSchedule(id: bigint): Promise<Schedule | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllSchedules(): Promise<Array<Schedule>>;
    listSchedules(): Promise<Array<Schedule>>;
    removeQuickBuyItem(itemIndex: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveSchedule(location: string, preferredDateTime: Time, budget: bigint, items: Array<Item>, selectedShop: Shop | null): Promise<bigint>;
}
