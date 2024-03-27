import { useFormik } from 'formik';
import * as Yup from 'yup';
import { coordinateProps } from '../Models/apiInterface';
import API from '../Services/service';

export const useCustomExcelCoordinateFormik = ({onError, onResponse, dataPolygonExcel, titleID}: {onError?: any, onResponse?: any, dataPolygonExcel?: any, titleID?: string}) => {
    console.log(1)
    console.log('dataPolygonExcel:', dataPolygonExcel)

    const formik = useFormik<coordinateProps>({
        initialValues: {
            name: '',
            wide: 0,
            type_area: '',
            type_danger: '',  
            coordinates: [],  
            typeWide: '',
            description: ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
            .notRequired(),
            description: Yup.string()
            .notRequired(),
            type_area: Yup.string()
            .notRequired(),
            type_danger: Yup.string()
            .notRequired(),
        }),
        onSubmit: async (values: any, {resetForm}) => {
            try {

                console.log('data values:', values)
                console.log('data custom:', dataPolygonExcel)

                const response = await API.customCoordinateExcelPolygon(titleID, dataPolygonExcel)
                console.log('reponse', response)

                if(response.data.status === 200) {  
                    onResponse(response.data.status)
                    resetForm()
                }else {
                    onError(response.data.message)
                    resetForm()
                }
            } catch (error: any) {
                console.log('error:', error)
                onError(error.message)
                resetForm()
            }
        }
    })

    return formik
}