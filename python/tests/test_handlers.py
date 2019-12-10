import pytest
import json


@pytest.mark.usefixtures("testapp")
class TestHandlers:

    def test_hello(self, testapp):
        """ Test the /hello endpoint. """

        rv = testapp.get('/hello')
        assert rv.status_code == 200
        assert rv.data == b'Hello, world!'

    def test_health(self, testapp):
        """ Test the /health health check. """

        rv = testapp.get('/health')
        assert rv.status_code == 200
        data = json.loads(rv.data.decode())
        assert data['results'][0]['output'] == 'access ok'

    @pytest.mark.parametrize('substring', ['<body>', '買う'])
    def test_tango(self, testapp, substring):
        """ Test the / endpoint. """

        rv = testapp.get('/')
        assert rv.status_code == 200
        assert rv.data.decode().find(substring) >= 0
