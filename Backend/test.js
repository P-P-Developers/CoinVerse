const axios = require('axios');
const qs = require('qs');

const config = {
  method: 'post',
  url: 'https://masterswift-beta.mastertrust.co.in/oauth2/token',
  auth: {
    username: 'DSdkK1j9Cy',
    password: '4yBOT2K9T60ST4SycPx52G2lL6PrFa7elxrynOC4ERBXMDppwqXqn6U6AYGs13zA'
  },
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  data: qs.stringify({
    grant_type: 'authorization_code',
    code: 'qszzq3Xmojl5a4ypKq-7mELVhgSeO0w2KpwIBc46OWQ.-r9odj19AUUTcw1uPbZSvB531OBqQ2gOmfJc5-G45tw',
    redirect_uri: 'https://software.markresearch.in/backend/mastertrust',
    authorization_response: 'authorization_response'
  })
};

axios(config)
  .then(response => {
    console.log('✅ Access Token:', response.data.access_token);
  })
  .catch(error => {
    console.error('❌ Token Fetch Error:', error.response?.data || error.message);
  });
