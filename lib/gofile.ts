import axios from 'axios'
import FormData from 'form-data'
import { createReadStream } from 'fs'

const GOFILE_API_BASE = 'https://api.gofile.io'

export async function getGofileServer(): Promise<string> {
  try {
    const response = await axios.get(`${GOFILE_API_BASE}/servers`)
    if (response.data.status === 'ok' && response.data.data.servers.length > 0) {
      return response.data.data.servers[0].name
    }
    throw new Error('No available Gofile servers')
  } catch (error) {
    console.error('Failed to get Gofile server:', error)
    throw new Error('Failed to get upload server')
  }
}

export async function uploadToGofile(
  filePath: string, 
  fileName: string
): Promise<{ downloadPage: string; downloadUrl: string; fileId: string }> {
  try {
    // Get best server
    const server = await getGofileServer()
    
    // Create form data
    const formData = new FormData()
    formData.append('file', createReadStream(filePath), fileName)

    // Upload file
    const response = await axios.post(
      `https://${server}.gofile.io/contents/uploadFile`,
      formData,
      {
        headers: formData.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    )

    if (response.data.status === 'ok') {
      const data = response.data.data
      return {
        downloadPage: data.downloadPage,
        downloadUrl: data.downloadPage, // Gofile provides downloadPage which users can visit
        fileId: data.fileId,
      }
    }
    
    throw new Error('Upload failed')
  } catch (error: any) {
    console.error('Failed to upload to Gofile:', error)
    throw new Error(error.response?.data?.message || 'Failed to upload file')
  }
}
