import pytest

from application import create_app, config


@pytest.fixture()
def testapp(request):
    app = create_app(config.TestConfig)
    client = app.test_client()

    def teardown():
        pass

    request.addfinalizer(teardown)

    return client
