module.exports = [
    /**
     * GET /_status
     * Returns empty body with 200 response code.
     */
    {
      method: 'GET',
      path: '/hello/world',
      handler: () => {
        return {
            "message": "Hello World!"
          };
      }
    }
  ]