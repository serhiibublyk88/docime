import { createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "../../services";
import { AvailableTest } from "../../types/apiTypes";

// Загрузка доступных тестов для пользователя
export const fetchAvailableTests = createAsyncThunk<AvailableTest[]>(
  "user/fetchAvailableTests",
  async () => {
    const tests = await userApi.getAvailableTests();
    return tests;
  }
);
