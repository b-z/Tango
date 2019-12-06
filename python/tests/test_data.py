import pytest
from application.controllers import data


@pytest.mark.usefixtures("testapp")
class TestHandlers:
    def test_get_list(self, testapp):
        """ Test Data.get_list function """

        words = data.Data.get_list()
        assert words[0]['kanji'] == '買う'
