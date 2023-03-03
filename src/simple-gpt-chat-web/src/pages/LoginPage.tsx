import { useOidc } from '@axa-fr/react-oidc';
import { Button } from 'antd';

const LoginPage = () => {
  const auth = useOidc();
  const login = async () => {
    if (!auth.isAuthenticated) {
      await auth.login();
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '-5%',
      }}
    >
      <Button
        size={'large'}
        style={{ width: '160px', height: '64px' }}
        type={'primary'}
        onClick={login}
      >
        请先登录
      </Button>
      <Button
        size={'large'}
        type={'link'}
        onClick={() => {
          window.open('https://auth-sts.imguan.com/Account/Register');
        }}
        style={{ marginTop: '16px' }}
      >
        注册
      </Button>
    </div>
  );
};

export default LoginPage;
