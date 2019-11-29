import pytest

from application import create_app


@pytest.fixture()
def testapp(request):
    app = create_app()
    client = app.test_client()

    def teardown():
        pass

    request.addfinalizer(teardown)

    return client
