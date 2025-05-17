import { inject } from "@angular/core"
import { AuthService } from "../auth.service";
import { CanActivateFn, Router } from "@angular/router";

const routerInjection = () => inject(Router);

const authService = () => inject(AuthService);

export const privateGuard: CanActivateFn = async () => {
    const router = routerInjection();

    const {data} = await authService().session();

    console.log(data);

    if (!data.session) {
        router.navigateByUrl('/auth/log-in');
    }

    return !!data.session;
}


export const publicGuard: CanActivateFn = async () => {
    const router = routerInjection();

    const {data} = await authService().session();

    console.log(data);

    if (data.session) {
        router.navigateByUrl('/');
    }

    return !data.session;
 }