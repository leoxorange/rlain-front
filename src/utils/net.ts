import { ofetch } from "ofetch";
import { getToken } from "./auth";

const url = typeof window !== 'undefined' ? "http://" + window.location.hostname + ":9876" : 'http://127.0.0.1:9876'

type Method = "get" | "post" | "put" | "delete"

// Helper to get auth headers
export const getAuthHeaders = (): Record<string, string> => {
    const token = getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
}

const req = async <R>(method: Method, resource: string, data?: Record<string, any>): Promise<R> => {
    switch(method) {
        case "get":
            return get<R>(resource, data)
        case "post":
            return post<R>(resource, data)
        case "put":
            return put<R>(resource, data)
        case "delete":
            return del<R>(resource, data)
    }
}

const get = async <R>(resource: string, data?: Record<string, any>): Promise<R> => {
    return await ofetch<R>(resource, {
        method: "GET",
        baseURL: url,
        query: data,
        headers: getAuthHeaders()
    });
}

async function post<R>(resource: string, data?: Record<string, any>): Promise<R> {
    return await ofetch<R>(resource, {
        method: "POST",
        baseURL: url,
        body: data,
        headers: getAuthHeaders()
    });
}

async function put<R>(resource: string, data?: Record<string, any>): Promise<R> {
    return await ofetch<R>(resource, {
        method: "PUT",
        baseURL: url,
        body: data,
        headers: getAuthHeaders()
    });
}

const del = async <R>(resource: string, data?: Record<string, any>): Promise<R> => {
    return await ofetch<R>(resource, {
        method: "DELETE",
        baseURL: url,
        body: data,
        headers: getAuthHeaders()
    });
}

const getBlob = async (resource: string) => {
    return await ofetch(resource, {
        method: "GET",
        baseURL: url,
        headers: getAuthHeaders(),
        responseType: 'blob' as any
    }) as Blob;
}

export const updateUserPreferences = async (
    userId: number,
    preferences: UserPreferences
): Promise<void> => {
    await put(`/users/${userId}/update_pref`, preferences)
}

export const updateUser = async (
    userId: number,
    userData: { email?: string; nickname?: string }
): Promise<UserInfo> => {
    return await put<UserInfo>(`/users/${userId}`, userData)
}

export {
    req,
    get,
    post,
    put,
    del,
    getBlob
};