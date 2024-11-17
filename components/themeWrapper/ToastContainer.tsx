import React from "react";
import { ToastContainer as ReactToastContainer, toast as ReactToast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ToastContainer = () => (
  <ReactToastContainer />
);

export const toast = ReactToast;
