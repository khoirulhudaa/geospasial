import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../Services/service';
import capitalizeEveryWord from '../Helpers/capitalizeEveryWord';

export const useTitleFormik = ({onError, onResponse, dinasID, dinasNAME, excelData}: {onError?: any, onResponse?: any, dinasID?: string, dinasNAME?: string, excelData?: any[]}) => {
    const formik = useFormik<any>({
        initialValues: {
            title: '',
            description: '',
            year: '',
            status: '',
            category: ''
        },
        validationSchema: Yup.object({
            title: Yup.string()
            .min(6, 'Minimal 6 karakter')
            .required('Tidak boleh kosong!'),
        }),
        onSubmit: async (values: any, {resetForm}) => {
            try {

                let dataExcel = null

                if(excelData && excelData !== null && excelData !== undefined) {
                function ubahStruktur(data: any) {
                    return {
                        name_location: data.name_location,
                        subdistrict: data?.subdistrict, // Contoh subdistrict, ganti dengan nilai yang sesuai
                        lat: parseFloat(data.lat),
                        long: parseFloat(data.long),
                        thumbnail: data?.thumbnail,
                    };
                    }
                    
                    // Mengubah setiap objek dalam array
                    dataExcel = excelData.map(ubahStruktur);
                    console.log('new data excel formik :', excelData.map(ubahStruktur))
                }

                const data = {
                    dinas_id: dinasID,
                    description: values.description,
                    type: 'public',
                    name_dinas: dinasNAME,
                    year: values.year,
                    category: values.category,
                    status: values.status,
                    ...(excelData && excelData !== null && excelData !== undefined ? { coordinate: dataExcel } : {}),
                    title: capitalizeEveryWord(values.title)
                }

                console.log('new data title :', data)
                
                const response = await API.addTitle(data)
                console.log(response)
                
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