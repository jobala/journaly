import React, { useEffect, useState } from 'react';
import ReactListView from 'react-listview-sticky-header';

import { ListItem } from './ListItem';
import { entryController } from '../../controllers/entry';
import { IEntryProps, IEntry } from '../../types';
import { MONTHS } from '../../constants';
import { styles } from './styles';
import './entries.css';

const Entries = (props: IEntryProps) => {
  const { setEntryId, setShowEditor } = props;
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    entryController.getAll()
      .then((allEntries) => {
        const parsed = prepareDataList(allEntries);
        setEntries(parsed);
      });
  }, []);

  const parseEntries = (allEntries: IEntry[]) => allEntries.reduce((obj: any, entry: IEntry) => {
    const dateObj = new Date(Number(entry.createdAt));
    const month = MONTHS[dateObj.getMonth()];

    if (obj[month]) {
      obj[month].items.push({
        title: <ListItem handleOnClick={handleOnClick} entry={entry} />,

      });
    } else {
      // eslint-disable-next-line no-param-reassign
      obj[month] = {
        items: [{
          title: <ListItem handleOnClick={handleOnClick} entry={entry} />,
        }],
      };
    }

    return obj;
  }, {});

  const prepareDataList = (allEntries: IEntry[]) => {
    const parsedEntries = parseEntries(allEntries);
    return Object.keys(parsedEntries).map((month) => {
      const obj = {
        headerName: month,
        ...parsedEntries[month],
      };
      return obj;
    });
  };

  const handleCreateEntry = () => {
    const entry = {
      text: JSON.stringify({ ops: [{ insert: '' }] }),
      favorite: false,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
    };

    entryController.addEntry(entry).then((newEntry) => {
      setEntryId(newEntry._id);
      setShowEditor(true);
    });
  };

  const handleOnClick = (id: string) => {
    setEntryId(id);
    setShowEditor(true);
  };

  return (
    <div>
      <div>
        {entries.length > 0
          && (
            <div>
              <ReactListView
                data={entries}
                headerAttName="headerName"
                itemsAttName="items"
                styles={styles}
              />
            </div>
          )}
      </div>
      <button type="button" onClick={handleCreateEntry}>Create Journal</button>
    </div>
  );
};

export default Entries;
