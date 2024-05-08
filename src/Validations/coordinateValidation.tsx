import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../Services/service';

export const useCoordinateFormik = ({onError, onResponse, titleID, condition}: {onError?: any, onResponse?: any, titleID?: string, condition: any[]}) => {
    const formik = useFormik<any>({
        initialValues: {
            name_location: '',
            subdistrict: '',
            lat: '',
            long: '',
            link: '',  
            address: '',  
            thumbnail: '',  
            condition: [],
            scale: '', 
            remark: '',
            code: '', // kode qgis
            pum: '', // kode PUM
            province: '',
            typeArea: '', // kab or kot
            ward: '', // desa
            provinceCode: '',
            typeAreaCode: '', //kode kabupaten
            subdistrictCode: '', // kode kecamatan
            wardCode: '', // kode desa
            wide: '', // luas
            source: '',
        },
        validationSchema: Yup.object({
            name_location: Yup.string()
            .min(6, 'Minimal 6 karakter')
            .required('Tidak boleh kosong!'),
            subdistrict: Yup.string()
            .required('Tidak boleh kosong!'),
            lat: Yup.string()
            .required('Tidak boleh kosong!'),
            long: Yup.string()
            .required('Tidak boleh kosong!'),
            address: Yup.string()
            .required(),
            link: Yup.string()
            .required(),
            thumbnail: Yup.string()
            .required(),
            province: Yup.string()
            .required(),
            typeArea: Yup.string()
            .required(),
            ward: Yup.string()
            .required(),
            pum: Yup.string()
            .required(),
            provinceCode: Yup.string()
            .required(),
            typeAreaCode: Yup.string()
            .required(),
            subdistrictCode: Yup.string()
            .required(),
            condition: Yup.array()
            .notRequired(),
        }),
        onSubmit: async (values: any, {resetForm}) => {
            try {
                
                const data = {
                    title_id: titleID,
                    name_location: values.name_location,
                    subdistrict: values.subdistrict,
                    lat: Number(values.lat),
                    long: Number(values.long),
                    address: values.address, 
                    link: values.link, 
                    category: 'Koordinat',
                    thumbnail: values.thumbnail, 
                    condition: condition,  
                    scale: values.scale, 
                    remark: values.remark,
                    code: values.code,
                    pum: values.pum,
                    province: values.province,
                    typeArea: values.typeArea,
                    ward: values.ward,
                    provinceCode: values.provinceCode,
                    typeAreaCode: values.typeAreaCode, //kode kabupaten
                    subdistrictCode: values.subdistrictCode,
                    wardCode: values.wardCode,
                    wide: values.wide,
                    source: values.source
                }
                
                console.log('data coordinate new:', data)
                
                const response = await API.addCoordinate(data)
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