import { Glassfy } from 'capacitor-plugin-glassfy';
import { setProAccessStatus } from '../../features/authLoading/slice';

export const checkGlassfyPermissions = async () => {
  try {
    const permissions = await Glassfy.permissions();

    permissions.all.forEach((p) => {
      switch (p.permissionId) {
        case 'pro_features':
          if (p.isValid) {
            setProAccessStatus(true);
          } else {
            console.log('Permission not valid:', p);
          }
          break;

        default:
          break;
      }
    });
  } catch (e) {
    console.error('Error fetching permissions:', e);
  }
};
