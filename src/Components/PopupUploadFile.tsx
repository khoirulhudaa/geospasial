import React from 'react'
import { FaDownload, FaFileExcel, FaTimes } from 'react-icons/fa'
import { popUpProps } from '../Models/componentInterface'
import { useCoordinateExcelFormik } from '../Validations/coordinateExcelValidation'
import SweetAlert from './SweetAlert'

const PopupUploadFile: React.FC<popUpProps> = ({
    onChange,
    nameFile,
    hendleClearFile,
    handleStatus,
    dataExcel,
    handleClose
}) => {

    const handleError = (error: string) => {
        handleStatus()
        hendleClearFile()
        SweetAlert({
            title: error,
            icon: 'error',
            showCancelButon: false
        })
    }

    const handleResponse = (response: number) => {
        if(response === 200) {
            handleStatus()
            hendleClearFile()
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

    const downloadExcel = () => {
        const fileName = 'format-sigeo.xlsx'; // Ganti dengan nama file Excel yang Anda miliki
        const url = '../assets/excel/SIGEO.xlsx'; // Ganti dengan URL atau path menuju file Excel Anda
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
    };

  return (
    <div className='w-screen h-screen fixed left-0 top-0 flex justify-center items-center z-[999999] bg-slate-700 bg-opacity-[0.7]'>
        <div className='w-[60%] bg-white items-center px-6 flex justify-start flex-wrap h-[100vh] pb-6 overflow-y-auto'>
           <div className='w-full mb-10 border-b border-b-slate-300 justify-between flex items-center'>
            <p className='w-max text-[24px] font-bold py-6'>Daftar Header</p>
            <div onClick={() => downloadExcel()} className='w-max px-4 py-2 text-center text-[14px] rounded-[6px] bg-green-600 text-white cursor-pointer flex items-center hover:brightness-[90%] active:scale-[0.98]'>Unduh template <FaDownload className='ml-2' /> </div>
           </div>
            <div className='w-1/3 mb-8 border-b border-b-slate-300 pb-6'>
                <div className='w-full flex items-center pr-6 justify-between mb-2'>
                    <div className='bg-green-200 text-green-500 text-[14px] rounded-lg h-max px-3 py-1 w-[70%]'>nama lokasi</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>Nama area lokasi</small>
            </div>
            <div className='w-1/3 mb-8 border-b border-b-slate-300 pb-6'>
                <div className='w-full flex items-center pr-6 justify-between mb-2'>
                    <div className='bg-green-200 text-green-500 text-[14px] rounded-lg h-max px-3 py-1 w-[70%]'>kecamatan</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>Kecamatan</small>
            </div>
            <div className='w-1/3 mb-8 border-b border-b-slate-300 pb-6'>
                <div className='w-full flex items-center justify-between mb-2'>
                    <div className='bg-green-200 text-green-500 text-[14px] rounded-lg h-max px-3 py-1 w-[70%]'>latitude, lat</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>garis horizontal</small>
            </div>
            <div className='w-1/3 mb-8 border-b border-b-slate-300 pb-6'>
                <div className='w-full flex items-center pr-6 justify-between mb-2'>
                    <div className='bg-green-200 text-green-500 text-[14px] rounded-lg h-max px-3 py-1 w-[70%]'>longitude, long</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>garis bujur</small>
            </div>
            <div className='w-1/3 mb-8 border-b border-b-slate-300 pb-6'>
                <div className='w-full flex items-center pr-6 justify-between mb-2'>
                    <div className='bg-green-200 text-green-500 text-[14px] rounded-lg h-max px-3 py-1 w-[70%]'>link</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>link google map</small>
            </div>
            <div className='w-1/3 mb-8 border-b border-b-slate-300 pb-6'>
                <div className='w-full flex items-center justify-between mb-2'>
                    <div className='bg-green-200 text-green-500 text-[14px] rounded-lg h-max px-3 py-1 w-[70%]'>thumbnail</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>link thumbnail</small>
            </div>
            <div className='w-1/3 mb-8 border-b border-b-slate-300 pb-6'>
                <div className='w-full flex items-center pr-6 justify-between mb-2'>
                    <div className='bg-green-200 text-green-500 text-[14px] rounded-lg h-max px-3 py-1 w-[70%]'>rawan</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>y/n</small>
            </div>
            <div className='w-1/3 mb-8 border-b border-b-slate-300 pb-6'>
                <div className='w-full flex items-center pr-6 justify-between mb-2'>
                    <div className='bg-green-200 text-green-500 text-[14px] rounded-lg h-max px-3 py-1 w-[70%]'>alamat</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>Alamat lokasi</small>
            </div>
            <div className='w-1/3 mb-8 border-b border-b-slate-300 pb-6'>
                <div className='w-full flex items-center justify-between mb-2'>
                    <div className='bg-green-200 text-green-500 text-[14px] rounded-lg h-max px-3 py-1 w-[70%]'>catatan</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>Catatan singkat</small>
            </div>
            <div className='w-1/3 mb-8 border-b border-b-slate-300 pb-6'>
                <div className='w-full flex items-center pr-6 justify-between mb-2'>
                    <div className='bg-green-200 text-green-500 text-[14px] rounded-lg h-max px-3 py-1 w-[70%]'>skala</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>Kecamatan/Nasional/Kabupaten</small>
            </div>
            <div className='w-1/3 mb-8 border-b border-b-slate-300 pb-6'>
                <div className='w-full flex items-center pr-6 justify-between mb-2'>
                    <div className='bg-green-200 text-green-500 text-[14px] rounded-lg h-max px-3 py-1 w-[70%]'>kode</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>Kode unsur (KUGI)</small>
            </div>
            <div className='w-1/3 mb-8 border-b border-b-slate-300 pb-6'>
                <div className='w-full flex items-center justify-between mb-2'>
                    <div className='bg-green-200 text-green-500 text-[14px] rounded-lg h-max px-3 py-1 w-[70%]'>kode pum</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>Kode PUM</small>
            </div>
            <div className='w-1/3 mb-8 border-b border-b-slate-300 pb-6'>
                <div className='w-full flex items-center pr-6 justify-between mb-2'>
                    <div className='bg-green-200 text-green-500 text-[14px] rounded-lg h-max px-3 py-1 w-[70%]'>provinsi</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>Nama Provinsi</small>
            </div>
            <div className='w-1/3 mb-8 border-b border-b-slate-300 pb-6'>
                <div className='w-full flex items-center pr-6 justify-between mb-2'>
                    <div className='bg-green-200 text-green-500 text-[14px] rounded-lg h-max px-3 py-1 w-[70%]'>kode provinsi</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>Kode provinsi (32)</small>
            </div>
            <div className='w-1/3 mb-8 border-b border-b-slate-300 pb-6'>
                <div className='w-full flex items-center justify-between mb-2'>
                    <div className='bg-green-200 text-green-500 text-[14px] rounded-lg h-max px-3 py-1 w-[70%]'>jenis wilayah</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>Kabupaten/Kota</small>
            </div>
            <div className='w-1/3 mb-8 border-b border-b-slate-300 pb-6'>
                <div className='w-full flex items-center pr-6 justify-between mb-2'>
                    <div className='bg-green-200 text-green-500 text-[14px] rounded-lg h-max px-3 py-1 w-[70%]'>desa</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>Nama desa</small>
            </div>
            <div className='w-1/3 mb-8 border-b border-b-slate-300 pb-6'>
                <div className='w-full flex items-center pr-6 justify-between mb-2'>
                    <div className='bg-green-200 text-green-500 text-[14px] rounded-lg h-max px-3 py-1 w-[70%]'>kode kabupaten</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>Kode kabupaten</small>
            </div>
            <div className='w-1/3 mb-8 border-b border-b-slate-300 pb-6'>
                <div className='w-full flex items-center justify-between mb-2'>
                    <div className='bg-green-200 text-green-500 text-[14px] rounded-lg h-max px-3 py-1 w-[70%]'>kode kecamatan</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>Kode kecamatan</small>
            </div>
            <div className='w-1/3 mb-8 border-b border-b-slate-300 pb-6'>
                <div className='w-full flex items-center pr-6 justify-between mb-2'>
                    <div className='bg-green-200 text-green-500 text-[14px] rounded-lg h-max px-3 py-1 w-[70%]'>kode desa</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>Kode desa</small>
            </div>
            <div className='w-1/3 mb-8 border-b border-b-slate-300 pb-6'>
                <div className='w-full flex items-center pr-6 justify-between mb-2'>
                    <div className='bg-green-200 text-green-500 text-[14px] rounded-lg h-max px-3 py-1 w-[70%]'>luas</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>Luas area</small>
            </div>
            <div className='w-1/3 mb-8 border-b border-b-slate-300 pb-6'>
                <div className='w-full flex items-center justify-between mb-2'>
                    <div className='bg-green-200 text-green-500 text-[14px] rounded-lg h-max px-3 py-1 w-[70%]'>sumber</div>
                    <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                </div>
                <small>Sumber informasi</small>
            </div>
        </div>
        <form onSubmit={coordinateFormik.handleSubmit} className='relative w-[40%] h-[100vh] bg-white px-6 border-l-[1px] border-l-slate-300'>
            <p className='w-full border-b border-b-slate-300 mb-9 py-6 text-[24px] font-bold'>File Excel</p>
            <div onClick={() => handleClose()} className='absolute top-4 right-6 ml-auto w-[50px] h-[50px] bg-red-500 text-white cursor-pointer hover:brightness-[90%] active:scale-[0.98] p-2 flex items-center justify-center shadow-md rounded-[6px]'>
                <FaTimes />
            </div>
        
            <div className='relative w-full h-[74%] border border-slate-700 rounded-[20px] flex flex-col justify-center items-center text-center'>
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
                        <div className='w-max h-max px-3 py-2 rounded-[10px] flex items-center justify-center bg-white'>
                            {nameFile}
                        </div>
                        <div onClick={() => hendleClearFile()} className='w-max h-max mt-3 px-4 py-2 rounded-[10px] flex items-center justify-center bg-red-500 cursor-pointer hover:brightness-[90%] active:scale-[0.98] text-white'>
                            <FaTimes className='text-white' />
                            <p className='ml-3'>Hapus File</p>
                        </div>
                        <div className='w-[70%] mx-auto h-[1px] bg-slate-500 mt-5 mb-1'>

                        </div>
                        <button type='submit' className='w-max hover:brightness-[90%] active:scale-[0.98] cursor-pointer h-max mt-5 px-6 py-2 rounded-[10px] flex items-center justify-center bg-slate-700 text-white'>
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
