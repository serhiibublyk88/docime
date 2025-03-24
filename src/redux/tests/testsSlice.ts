import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TestsState, Test } from "../../types/reduxTypes";
import { fetchAllGroups, updateTestGroups } from "./testsActions";

const initialState: TestsState = {
  tests: [],
  currentTest: null,
  loading: false,
  error: null,
  allGroups: [],
};

const testsSlice = createSlice({
  name: "tests",
  initialState,
  reducers: {
    setCurrentTest(state, action: PayloadAction<Test | null>) {
      state.currentTest = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchAllGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchAllGroups.fulfilled,
        (state, action: PayloadAction<{ id: string; name: string }[]>) => {
          state.loading = false;
          state.allGroups = action.payload ?? [];
        }
      )
      .addCase(fetchAllGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Fehler beim Abrufen der Gruppen";
      })

      .addCase(
        updateTestGroups.fulfilled,
        (
          state,
          action: PayloadAction<{
            testId: string;
            availableForGroups: { id: string; name: string }[];
          }>
        ) => {
          const uniqueGroups = Array.from(
            new Map(
              action.payload.availableForGroups.map((group) => [
                group.id,
                group,
              ])
            ).values()
          );

          const testIndex = state.tests.findIndex(
            (test) => test.id === action.payload.testId
          );
          if (testIndex !== -1) {
            state.tests[testIndex].availableForGroups = uniqueGroups;
          }

          if (state.currentTest?.id === action.payload.testId) {
            state.currentTest = {
              ...state.currentTest,
              availableForGroups: uniqueGroups,
            };
          }
        }
      )

      .addCase(updateTestGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Fehler beim Aktualisieren der Gruppen";
      });
  },
});

export const { setCurrentTest } = testsSlice.actions;
export const testsReducer = testsSlice.reducer;
