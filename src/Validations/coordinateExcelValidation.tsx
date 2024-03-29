import { useFormik } from 'formik';
import * as Yup from 'yup';
import { coordinateProps } from '../Models/apiInterface';
import API from '../Services/service';

export const useCoordinateExcelFormik = ({onError, onResponse, dataCoordinateExcel}: {onError?: any, onResponse?: any, dataCoordinateExcel?: any}) => {
    const formik = useFormik<coordinateProps>({
        initialValues: {
            name_location: '',
            subdistrict: '',
            lat: '',
            long: '',
            link: '',  
            address: '',  
            thumbnail: '',  
            condition: [],  
        },
        validationSchema: Yup.object({
            condition: Yup.array()
            .notRequired(),
        }),
        onSubmit: async (values: any, {resetForm}) => {
            try {

                console.log('values:', values)
                console.log('data coordinate excel new:', dataCoordinateExcel)
                
                const response = await API.addCoordinateExcel(dataCoordinateExcel)
                console.log('response coordinate excel:', response)

                if(response.data.status === 200) {  
                    onResponse(response.data.status)
                    resetForm()
                }else {
                    onError(response.data.message)
                }
            } catch (error: any) {
                onError(error.message)
            }
        }
    })

    return formik
}