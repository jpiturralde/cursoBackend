import multer from 'multer'

export const imageLoaderMdw = (imagePath) => {
    const storage = multer.diskStorage({
        imgUri: function (req, file, cb) {
            cb(null, '/views/images')
          },
        destination: function (req, file, cb) {
          cb(null, imagePath)
        },
        filename: function (req, file, cb) {
          cb(null, `${Date.now()}-${file.originalname}`)
        }
    })
    
    return multer({ storage: storage })
}