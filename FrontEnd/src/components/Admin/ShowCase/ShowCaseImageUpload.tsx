import  { useCallback, DragEvent, ChangeEvent } from 'react'
import { Upload, X } from 'lucide-react'
interface ImageUploadProps {
  images: File[]
  onChange: (images: File[]) => void
  error?: string
}
function ImageUpload({ images, onChange, error }: ImageUploadProps) {
  const handleDrop = useCallback(
    (e: DragEvent | ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      const files = Array.from(
        (e as DragEvent).dataTransfer?.files ||
          (e as ChangeEvent<HTMLInputElement>).target.files,
      )
      const validFiles = files.filter((file): file is File => file.type.startsWith('image/'))

      onChange([...images, ...validFiles])
    },
    [images, onChange],
  )
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
  }
  const removeImage = (index: number) => {
    const newImages = [...images]

    newImages.splice(index, 1)
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          multiple
          accept="image/*"
          className="hidden"
          id="image-upload"
          type="file"
          onChange={handleDrop}
        />
        <label
          className="cursor-pointer flex flex-col items-center"
          htmlFor="image-upload"
        >
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-gray-600">
            Drag and drop images here or click to upload
          </span>
          <span className="text-sm text-gray-500 mt-1">
            Supported formats: JPG, PNG, GIF
          </span>
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                alt={`Upload ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
                src={URL.createObjectURL(image)}
              />
              <button
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                type="button"
                onClick={() => removeImage(index)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default ImageUpload
