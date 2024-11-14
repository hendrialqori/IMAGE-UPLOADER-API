export const SECRET_KEY = process.env.SECRET_KEY
export const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN
export const PORT = process.env.PORT

export const MAX_IMAGE_SIZE = 3000000 //3mb
export const ALLOWS_MIME_TYPE = ["image/png", "image/jpg", "image/jpeg"] as const

export const LEADERBOARD = "leaderboard"

// image type mapping
export const imageTypeValueMapping = {
    "Reusable Utensils": 3,
    "Non Reusable Utensils": 0,
    "Water Container/Tumbler": 5,
    "Public Transportation": 10,
    "Pertamax Personal Vehicle": 3,
    "Non Pertamax Personal Vehicle": 0,
    "Electric Vehicle": 10,
    "Litter Filter": 5,
    "Single Waste Bin": 2
}
