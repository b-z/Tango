import pytest
from application.controllers import data


@pytest.mark.usefixtures("testapp")
class TestHandlers:

    @pytest.mark.parametrize('id, test_input, expected', [(0, 'kanji', '買う'), (1, 'hiragana', 'たいぼく')])
    def test_get_list(self, testapp, id, test_input, expected):
        """ Test Data.get_list function """

        words = data.Data.get_list()
        assert words[id][test_input] == expected
