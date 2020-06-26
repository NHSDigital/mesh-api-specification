module.exports = [
    /**
     * GET /_status
     * Returns empty body with 200 response code.
     */
    {
      method: 'GET',
      path: '/hello/user',
      handler: () => {
        return {
            "message": "Hello User!"
          };
      }
    }
  ]