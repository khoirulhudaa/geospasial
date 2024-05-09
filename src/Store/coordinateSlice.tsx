import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface coordinateState {
    coordinate: any[][],
    coordinate_id: string
}

const initialState: coordinateState = {
    coordinate: [],
    coordinate_id: ''
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
        getCoordinateID: (state, action: PayloadAction<string>) => {
            state.coordinate_id = action.payload;
        },
        removeCoordinateID: (state) => {
            state.coordinate_id = '';
        },
        clearCoordinate: (state) => {
            state.coordinate = []
        },
    }
})

export const { getCoordinate, removeCoordinateById, getCoordinateID, removeCoordinateID, clearCoordinate } = coordinateSlide.actions;
export default coordinateSlide.reducer;

