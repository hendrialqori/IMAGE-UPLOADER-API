import express from 'express';
import AuthController from '../controllers/auth.controller';
import ImageController from '../controllers/image.controller';
import { accessValidation, authorizeRole } from '../middlewares/auth.middleware';
import { imageUpload } from '../utils/upload';
import { Role } from '../@types';
import UserController from '../controllers/user.controller';

const apiRouter = express.Router()
const ROUTE = "/api/v1"

const SUPER_ADMIN = ["SUPER_ADMIN"] as Role[]
const MEMBER = ["MEMBER"] as Role[]
const ALL_ROLES = [...SUPER_ADMIN, ...MEMBER] as Role[]

const validation = (allowedRoles: Role[]) => [accessValidation, authorizeRole(allowedRoles)]

// auth
apiRouter.post(`${ROUTE}/auth/login`, AuthController.login)
apiRouter.post(`${ROUTE}/auth/register`, AuthController.register)
apiRouter.get(`${ROUTE}/auth/credential`, validation(ALL_ROLES), AuthController.credential)

// users
apiRouter.get(`${ROUTE}/user/list`, validation(SUPER_ADMIN),
    UserController.list
)
// images
apiRouter.get(`${ROUTE}/image/list/:userId`, validation(SUPER_ADMIN),
    ImageController.listByUserId
)
apiRouter.post(`${ROUTE}/image/add`, [...validation(ALL_ROLES), imageUpload.single("image")],
    ImageController.add
)
apiRouter.put(`${ROUTE}/image/update-score/:imageId`, validation(SUPER_ADMIN),
    ImageController.updatePoint
)
apiRouter.delete(`${ROUTE}/image/remove/:imageId`, validation(SUPER_ADMIN),
    ImageController.remove
)



export default apiRouter

