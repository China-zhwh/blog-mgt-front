import RenderAuthorized from '@/components/Authorized';
import { getFunctionAuthority } from './userInfo';

let Authorized = RenderAuthorized(getFunctionAuthority()); // eslint-disable-line

// Reload the rights component
const reloadAuthorized = () => {
  Authorized = RenderAuthorized(getFunctionAuthority());
};

export { reloadAuthorized };
export default Authorized;
