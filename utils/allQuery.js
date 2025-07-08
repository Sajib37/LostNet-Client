import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

export const BASE_URL = 'https://lostnet-server.onrender.com';

export const fetchItems = async () => {
  const response = await axios.get(`${BASE_URL}/api/v1/item`);
  return response.data?.data || [];
};

export const fetchItemById = async (id) => {
  const response = await axios.get(`${BASE_URL}/api/v1/item/get-single-item/${id}`);
  return response.data?.data || null;
};


export const updateUserProfile = async ({ userId, formData }) => {
  const response = await axios.patch(
    `${BASE_URL}/api/v1/users/${userId}`,
    formData,
    {
      headers: {
        Accept: "application/json", 
      },
      transformRequest: (data, headers) => {
        return data; 
      },
    }
  );
  return response.data;
};

// fetch user by id
export const fetchUserById = async () => {
  const token = await AsyncStorage.getItem("accessToken");
  if (!token) throw new Error("No token found");

  const decoded = jwtDecode(token);
  const userId = decoded?.id;
  if (!userId) throw new Error("Invalid token");

  const res = await axios.get(`${BASE_URL}/api/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data?.data;
};


export const fetchItemsByUserId = async (userId) => {
  const response = await axios.get(`${BASE_URL}/api/v1/item/get-items-by-user/${userId}`);
  return response.data?.data || [];
};

export const requestItemById = async ({ itemId, token }) => {
  const decoded = jwtDecode(token);
  const requestedBy = decoded?.id;

  if (!requestedBy) {
    throw new Error("User ID not found.");
  }

  const payload = {
    itemId,
    requestedBy,
  };

  const response = await axios.post(
    `${BASE_URL}/api/v1/item-request`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};


export const deleteItemById = async (id) => {
  const res = await axios.delete(`${BASE_URL}/api/v1/item/${id}`);
  return res.data;
};


export const fetchRequestsByItemId = async (itemId) => {
  const res = await axios.get(
    `${BASE_URL}/api/v1/item-request/by-item/${itemId}`
  );
  return res.data.data;
};

export const updateItemStatus = async ({ itemId, token }) => {
  const res = await axios.patch(
    `${BASE_URL}/api/v1/item/${itemId}`,
    { status: "Delivered" },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};