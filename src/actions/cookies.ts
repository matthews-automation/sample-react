'use server'
 import { cookies } from 'next/headers';
 
export const setCookie = async (data: { name: string, value: string, options?: { [key: string]: string | Date } }) => {
  const cookie = cookies()
  cookie.set(data.name, data.value, { ...data.options });
  return;
}

export const getCookie = async (name: string) => {
  const cookie = cookies()
  return await cookie.get(name)?.value;
}

export const removeCookie = async (name: string) => {
  const cookie = cookies()
  await cookie.delete(name)
  return;
}