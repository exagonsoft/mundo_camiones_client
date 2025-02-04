import { signIn, signOut } from "@/auth";
import { config } from "./constants";
import { Auction, AuctionDetail, AuctionDetailsResponse, AuctionListResponse, User, UserListResponse, Vehicle, VehicleListResponse } from "@/app/types/auction";

interface authParams {
  redirect: boolean;
  username: string;
  password: string;
}

export async function authenticateAction({
  redirect,
  username,
  password,
}: authParams) {
  try {
    const result = await signIn("credentials", {
      redirect,
      username,
      password,
    });

    return result;
  } catch (error) {
    console.log("Sign in Error: ", error);
  }
}

export async function logOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function getVehicles(token: string): Promise<VehicleListResponse> {
  try {
     const _vehiclesResponse = await fetch(`${config.baseBusinessUrl}/vehicles/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (_vehiclesResponse.ok) {
      const response = await _vehiclesResponse.json();
      return { data: response as Vehicle[], errors: null };
    } else {
      return { data: null, errors: "Error Fetching Vehicles" };
    }
  } catch (error) {
    console.warn("Error Fetching Vehicles, ", error);
    return { data: null, errors: "Error Fetching Vehicles" };
  }
}

export const vehicleCreateRequest = async (
  data: Vehicle,
  authToken: string | undefined
) => {
  try {

    const _response = await fetch(`${config.baseBusinessUrl}/vehicles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },

      body: JSON.stringify(data),
    });

    if (_response.ok) {
      const response = await _response.json();
      return { data: response, errors: null };
    } else {
      return { errors: "Error Creating Employee", data: null };
    }
  } catch (error) {
    console.log("Error: ", error);
    throw new Error("Failed to fetch from API");
  }
};

export const vehicleUpdateRequest = async (
  vehicleId: string,
  data: Vehicle,
  authToken: string | undefined
) => {
  try {

    const _response = await fetch(`${config.baseBusinessUrl}/vehicles/${vehicleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },

      body: JSON.stringify(data),
    });

    if (_response.ok) {
      const response = await _response.json();
      return { data: response, errors: null };
    } else {
      return { errors: "Error Creating Employee", data: null };
    }
  } catch (error) {
    console.log("Error: ", error);
    throw new Error("Failed to fetch from API");
  }
};

export const vehicleDeleteRequest = async (
  vehicleId: string,
  authToken: string | undefined
) => {
  try {

    const _response = await fetch(`${config.baseBusinessUrl}/vehicles/${vehicleId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (_response.ok) {
      const response = await _response.json();
      return { data: response, errors: null };
    } else {
      return { errors: "Error Creating Employee", data: null };
    }
  } catch (error) {
    console.log("Error: ", error);
    throw new Error("Failed to fetch from API");
  }
};

export async function getUsers(token: string): Promise<UserListResponse> {
  try {
     const _vehiclesResponse = await fetch(`${config.baseAuthUrl}/users/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (_vehiclesResponse.ok) {
      const response = await _vehiclesResponse.json();
      return { data: response as User[], errors: null };
    } else {
      return { data: null, errors: "Error Fetching Vehicles" };
    }
  } catch (error) {
    console.warn("Error Fetching Vehicles, ", error);
    return { data: null, errors: "Error Fetching Vehicles" };
  }
}

export const userDeleteRequest = async (
  userId: string,
  authToken: string | undefined
) => {
  try {

    const _response = await fetch(`${config.baseAuthUrl}/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (_response.ok) {
      const response = await _response.json();
      return { data: response, errors: null };
    } else {
      return { errors: "Error Deleting User", data: null };
    }
  } catch (error) {
    console.log("Error: ", error);
    throw new Error("Failed to fetch from API");
  }
};

export const userCreateRequest = async (
  data: User,
  authToken: string | undefined
) => {
  try {

    const _response = await fetch(`${config.baseAuthUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },

      body: JSON.stringify(data),
    });

    if (_response.ok) {
      const response = await _response.json();
      return { data: response, errors: null };
    } else {
      return { errors: "Error Creating User", data: null };
    }
  } catch (error) {
    console.log("Error: ", error);
    throw new Error("Failed to fetch from API");
  }
};

export const userUpdateRequest = async (
  _id: string,
  data: User,
  authToken: string | undefined
) => {
  try {

    const _response = await fetch(`${config.baseAuthUrl}/users/${_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },

      body: JSON.stringify(data),
    });

    if (_response.ok) {
      const response = await _response.json();
      return { data: response, errors: null };
    } else {
      return { errors: "Error Creating User", data: null };
    }
  } catch (error) {
    console.log("Error: ", error);
    throw new Error("Failed to fetch from API");
  }
};

export async function getAuctions(token: string): Promise<AuctionListResponse> {
  try {
     const _auctionsResponse = await fetch(`${config.baseBusinessUrl}/auctions/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (_auctionsResponse.ok) {
      const response = await _auctionsResponse.json();
      return { data: response as Auction[], errors: null };
    } else {
      return { data: null, errors: "Error Fetching Vehicles" };
    }
  } catch (error) {
    console.warn("Error Fetching Vehicles, ", error);
    return { data: null, errors: "Error Fetching Vehicles" };
  }
}

export const auctionDeleteRequest = async (
  auctionId: string,
  authToken: string | undefined
) => {
  try {

    const _response = await fetch(`${config.baseBusinessUrl}/auctions/${auctionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (_response.ok) {
      const response = await _response.json();
      return { data: response, errors: null };
    } else {
      return { errors: "Error Deleting User", data: null };
    }
  } catch (error) {
    console.log("Error: ", error);
    throw new Error("Failed to fetch from API");
  }
};

export const auctionCreateRequest = async (
  data: Auction,
  authToken: string | undefined
) => {
  try {

    const _response = await fetch(`${config.baseBusinessUrl}/auctions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },

      body: JSON.stringify(data),
    });

    if (_response.ok) {
      const response = await _response.json();
      return { data: response, errors: null };
    } else {
      return { errors: "Error Creating Auction", data: null };
    }
  } catch (error) {
    console.log("Error: ", error);
    throw new Error("Failed to Create Auction");
  }
};

export const auctionUpdateRequest = async (
  auctionId: string,
  data: Auction,
  authToken: string | undefined
) => {
  try {

    const _response = await fetch(`${config.baseBusinessUrl}/auctions/${auctionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },

      body: JSON.stringify(data),
    });

    if (_response.ok) {
      const response = await _response.json();
      return { data: response, errors: null };
    } else {
      return { errors: "Error Creating Auction", data: null };
    }
  } catch (error) {
    console.log("Error: ", error);
    throw new Error("Failed to Create Auction on the API");
  }
};

export async function getAuctionDetails(auctionId: string,token: string): Promise<AuctionDetailsResponse> {
  try {
     const _auctionsResponse = await fetch(`${config.baseBusinessUrl}/auctions/${auctionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (_auctionsResponse.ok) {
      const response = await _auctionsResponse.json();
      return { data: response as AuctionDetail, errors: null };
    } else {
      return { data: null, errors: "Error Fetching Vehicles" };
    }
  } catch (error) {
    console.warn("Error Fetching Vehicles, ", error);
    return { data: null, errors: "Error Fetching Vehicles" };
  }
}