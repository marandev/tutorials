const Nexmo = require('nexmo');
const nexmo = new Nexmo({
    apiKey: process.env.NEXMO_API_KEY,
    apiSecret: process.env.NEXMO_API_SECRET,
});

const request = (mobileNumber) => {
    return nexmo.verify.request({
        number: mobileNumber,
        brand: process.env.NEXMO_BRAND_NAME
    }, (err, result) => {
        if (err) {
            throw err;
        }
        console.log(result);

        if (result.status !== '0') {
            return {
              status: 'FAILED',
              error: result.error_text
            }
        }
        
        return {
          status: 'OK',
          verifiedId: result.request_id
        }
    });
}

const verify = async (requestId, code) => {
    return await nexmo.verify.check({
        request_id: requestId,
        code: code
    }, (err, result) => {
        if (err) {
            throw err;
        } else {
            if (result.status !== '0') {
                return false;
            }

            return true;
        }
    });
}

const cancel = async (requestId) => {
    await nexmo.verify.control({
        request_id: requestId,
        cmd: 'cancel'
      }, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          console.log(result);
        }
      });
}

module.exports = {
    request,
    verify,
    cancel
}