const mockGet = jest.fn(url => {
  console.error(`[__mocks__/axios.js mockGet] CALLED with URL: "${url}". Default behavior: reject.`);
  return Promise.reject(new Error(`[__mocks__/axios.js mockGet] Unmocked direct axios.get call to ${url}`));
});

const mockPost = jest.fn((url, data) => {
  console.error(`[__mocks__/axios.js mockPost] CALLED with URL: "${url}", DATA: ${JSON.stringify(data)}. Default behavior: reject.`);
  return Promise.reject(new Error(`[__mocks__/axios.js mockPost] Unmocked direct axios.post call to ${url}`));
});

const mockPut = jest.fn((url, data) => {
  console.error(`[__mocks__/axios.js mockPut] CALLED with URL: "${url}", DATA: ${JSON.stringify(data)}. Default behavior: reject.`);
  return Promise.reject(new Error(`[__mocks__/axios.js mockPut] Unmocked direct axios.put call to ${url}`));
});

const mockDelete = jest.fn(url => {
  console.error(`[__mocks__/axios.js mockDelete] CALLED with URL: "${url}". Default behavior: reject.`);
  return Promise.reject(new Error(`[__mocks__/axios.js mockDelete] Unmocked direct axios.delete call to ${url}`));
});

const mockAxiosInstance = {
  get: mockGet,
  post: mockPost,
  put: mockPut,
  delete: mockDelete,
  defaults: { headers: { common: {} } },
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() }
  }
};

// Main axios mock object (should be a function)
const axiosMock = jest.fn(config => {
  console.error(`[__mocks__/axios.js axiosMock] CALLED AS FUNCTION with config: ${JSON.stringify(config)}. Delegating based on method or defaulting to GET.`);
  if (config && config.url) {
    const method = config.method ? config.method.toLowerCase() : 'get';
    switch (method) {
      case 'post':
        return mockPost(config.url, config.data);
      case 'put':
        return mockPut(config.url, config.data);
      case 'delete':
        return mockDelete(config.url);
      case 'get':
      default:
        return mockGet(config.url);
    }
  }
  return Promise.reject(new Error('[__mocks__/axios.js axiosMock] Unhandled call as function without proper config'));
});

// Assign methods like .get, .post, .create to the axiosMock function
axiosMock.get = mockGet;
axiosMock.post = mockPost;
axiosMock.put = mockPut;
axiosMock.delete = mockDelete;
axiosMock.defaults = { ...mockAxiosInstance.defaults };
axiosMock.interceptors = {
  request: { use: jest.fn(), eject: jest.fn() },
  response: { use: jest.fn(), eject: jest.fn() }
};

axiosMock.create = jest.fn(config => {
  console.error(`[__mocks__/axios.js axiosMock.create] CALLED with config: ${JSON.stringify(config)}. Returning an instance that uses the same shared mock methods (get, post, etc.).`);
  // Return an object that uses the same top-level mockGet, mockPost functions.
  // This ensures that if a test mocks axios.get, it affects instances created via axios.create().
  return {
    get: mockGet, // Critical: instance.get uses the same mockGet as axios.get
    post: mockPost,
    put: mockPut,
    delete: mockDelete,
    defaults: { ...mockAxiosInstance.defaults, ...config },
    interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() }
    }
  };
});

module.exports = axiosMock;