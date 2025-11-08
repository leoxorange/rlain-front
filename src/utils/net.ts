import { ofetch } from "ofetch";
import { getToken } from "./auth";

const url = typeof window !== 'undefined' ? "http://" + window.location.hostname + ":9876" : 'http://127.0.0.1:9876'

type Method = "get" | "post" | "put" | "delete"

// Helper to get auth headers
export const getAuthHeaders = (): Record<string, string> => {
    const token = getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
}

const req = async <D>(method: Method, resource: string, data?: Record<string, any>) => {
    switch(method) {
        case "get":
            return get<D>(resource, data)
        case "post":
            return post<D>(resource, data)
        case "put":
            return put<D>(resource, data)
        case "delete":
            return del<D>(resource, data)
    }
}

const get = async <D>(resource: string, data?: Record<string, any>) => {
    return await ofetch<D>(resource, {
        method: "GET",
        baseURL: url,
        query: data,
        headers: getAuthHeaders()
    });
}

const post = async <D>(resource: string, data?: Record<string, any>) => {
    return await ofetch<D>(resource, {
        method: "POST",
        baseURL: url,
        body: data,
        headers: getAuthHeaders()
    });
}

const put = async <D>(resource: string, data?: Record<string, any>) => {
    return await ofetch<D>(resource, {
        method: "PUT",
        baseURL: url,
        body: data,
        headers: getAuthHeaders()
    });
}

const del = async <D>(resource: string, data?: Record<string, any>) => {
    return await ofetch<D>(resource, {
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

export {
    req,
    get,
    post,
    put,
    del,
    getBlob
};