const response = (status, message, data = []) => {
   return {
      status,
      message,
      ...(data?.data ? data : { data: data }),
   };
};

module.exports = response;