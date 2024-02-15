import { lazy } from "react";

const Homepage = lazy(() => import('../Pages'))
const Login = lazy(() => import('../Pages/login'))

interface routerProps {
    path: string,
    component: React.FC<{}>,
    exact: boolean
}

const Routers: routerProps[] = [
    {
        path: '/',
        component: Login,
        exact: true
    },
    {
        path: '/home',
        component: Homepage,
        exact: true
    },
]

export default Routers