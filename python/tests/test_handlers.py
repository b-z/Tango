import pytest


@pytest.mark.usefixtures("testapp")
class TestHandlers:
    def test_hello(self, testapp):
        """ Test the /hello endpoint """

        rv = testapp.get('/hello')
        assert rv.status_code == 200
        print(rv.data)
