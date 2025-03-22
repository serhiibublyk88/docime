// src/hooks/useAppSelector.ts
import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "../redux";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
