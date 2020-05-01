export const handleAuthentication = (history) => {
  this.auth0.parseHash((err, authResult) => {
    if (authResult && authResult.accessToken && authResult.idToken) {
      this.setSession(authResult);
      history.push("/");
    } else if (err) {
      console.log(err);
    }
  });
}

export const setSession = (authResult) => {
  let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
  localStorage.setItem('access_token', authResult.accessToken);
  localStorage.setItem('id_token', authResult.idToken);
  localStorage.setItem('expires_at', expiresAt);
}

export const isAuthenticated = () => {
  let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
  return new Date().getTime() < expiresAt;
}

export const getAccessToken = () => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('No access token found');
  }
  return accessToken;
}

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('id_token');
  localStorage.removeItem('expires_at');
  window.location.href = '/';
}