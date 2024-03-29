import React from 'react'
import { FaFileExcel, FaTimes } from 'react-icons/fa'
import { popUpProps } from '../Models/componentInterface'
import { useCoordinateExcelFormik } from '../Validations/coordinateExcelValidation'
import SweetAlert from './SweetAlert'

const PopupUploadFile: React.FC<popUpProps> = ({
    onChange,
    nameFile,
    hendleClear,
    handleStatus,
    dataExcel
}) => {

    const handleError = (error: string) => {
        hendleClear()
        SweetAlert({
            title: error,
            icon: 'error',
            showCancelButon: false
        })
    }

    const handleResponse = (response: number) => {
        if(response === 200) {
            handleStatus()
            hendleClear()
            SweetAlert({
                title: 'Berhasil Upload Data',
                icon: 'success',
                showCancelButton: false
            })
        }
    }

    const coordinateFormik = useCoordinateExcelFormik({
        onError: handleError,
        onResponse: handleResponse,
        dataCoordinateExcel: dataExcel
    })

  return (
    <div className='w-screen px-[200px] h-screen fixed left-0 top-0 flex justify-center items-center z-[999999] bg-slate-700 bg-opacity-[0.7]'>
        <div className='w-[50%] bg-white items-center p-6 flex justify-between flex-wrap rounded-tl-[20px] rounded-bl-[20px] h-[70vh]'>
           <p className='w-full border-b border-b-slate-300 pb-3'>Daftar Header File Excel</p>
            <div className='w-1/2 mb-5'>
                <div className='w-full flex items-center'>
                    <div className='bg-green-200 text-green-500 rounded-lg w-max h-max px-3 py-1'>nama lokasi</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>Nama area lokasi</small>
            </div>
            <div className='w-1/2 mb-5'>
                <div className='w-full flex items-center'>
                    <div className='bg-green-200 text-green-500 rounded-lg w-max h-max px-3 py-1'>kecamatan</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>Kecamatan</small>
            </div>
            <div className='w-1/2 mb-5'>
                <div className='w-full flex items-center'>
                    <div className='bg-green-200 text-green-500 rounded-lg w-max h-max px-3 py-1'>latitude, lat</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>garis horizontal</small>
            </div>
            <div className='w-1/2 mb-5'>
                <div className='w-full flex items-center'>
                    <div className='bg-green-200 text-green-500 rounded-lg w-max h-max px-3 py-1'>longitude, long</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>garis bujur</small>
            </div>
            <div className='w-1/2 mb-5'>
                <div className='w-full flex items-center'>
                    <div className='bg-green-200 text-green-500 rounded-lg w-max h-max px-3 py-1'>link</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>link google map</small>
            </div>
            <div className='w-1/2 mb-5'>
                <div className='w-full flex items-center'>
                    <div className='bg-green-200 text-green-500 rounded-lg w-max h-max px-3 py-1'>thumbnail</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>link thumbnail</small>
            </div>
            <div className='w-1/2 mb-5'>
                <div className='w-full flex items-center'>
                    <div className='bg-green-200 text-green-500 rounded-lg w-max h-max px-3 py-1'>rawan</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>y/n (area rawan atau bukan)</small>
            </div>
            <div className='w-1/2 mb-5'>
                <div className='w-full flex items-center'>
                    <div className='bg-green-200 text-green-500 rounded-lg w-max h-max px-3 py-1'>alamat</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>Alamat lokasi/koordinat</small>
            </div>
        </div>
        <form onSubmit={coordinateFormik.handleSubmit} className='w-[50%] h-max rounded-tr-[20px] rounded-br-[20px] bg-white p-7 border -l-[1px] border-l-slate-300'>
            <div className='relative w-full h-[400px] border border-slate-700 rounded-[20px] flex flex-col justify-center items-center text-center'>
                {
                    nameFile === '' ? (
                        <div className='absolute overflow-hidden rounded-[20px] active:scale-[0.98] w-full flex-col h-full bg-white cursor-pointer hover:brightness-[94%] flex justify-center items-center'>
                            <div className='absolute text-center flex flex-col items-center'>
                                <FaFileExcel className='text-[30px]' />
                                <p className='mt-8'>Tambahkan file excel</p>
                            </div>
                            <input accept=".xlsx, .xls" type="file" name='excel' onChange={(e: any) => onChange(e)} className='w-full bg-white cursor-pointer opacity-0 z-40 h-[30%]' />
                        </div>
                    ):
                    <div className='absolute overflow-hidden rounded-[20px] active:scale-[0.98] w-full flex-col h-full bg-white cursor-pointer hover:brightness-[94%] flex justify-center items-center'>
                        <FaFileExcel className='text-[30px] mb-4' />
                        <div className='w-max h-max px-3 py-2 rounded-full flex items-center justify-center bg-white'>
                            {nameFile}
                        </div>
                        <div onClick={() => hendleClear()} className='w-max h-max mt-3 px-4 py-2 rounded-full flex items-center justify-center bg-red-500 text-white'>
                            <FaTimes className='text-white' />
                            <p className='ml-3'>Hapus File</p>
                        </div>
                        <div className='w-[70%] mx-auto h-[1px] bg-slate-500 mt-5 mb-1'>

                        </div>
                        <button type='submit' className='w-max h-max mt-5 px-6 py-2 rounded-full flex items-center justify-center bg-slate-700 text-white'>
                            <p>Simpan sekarang</p>
                        </button>
                    </div>
                }
            </div>
        </form>
    </div>
  )
}

export default PopupUploadFile
