import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface coordinateState {
    coordinate: any[][]
}

const initialState: coordinateState = {
    coordinate: [],
}

const coordinateSlide = createSlice({
    name: 'coordinate',
    initialState,   
    reducers: {
        getCoordinate: (state, action: PayloadAction<any[]>) => {
            state.coordinate.push(action.payload);
        },
        removeCoordinateById: (state, action: PayloadAction<number>) => {
            state.coordinate.splice(action.payload,  1);
        },
        clearCoordinate: (state) => {
            state.coordinate = []
        },
    }
})

export const { getCoordinate, removeCoordinateById, clearCoordinate } = coordinateSlide.actions;
export default coordinateSlide.reducer;

