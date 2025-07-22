import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchNotes } from '../../services/noteService';
import { useDebouncedCallback } from 'use-debounce';
import NoteList from '../NoteList/NoteList';
import Paginaition from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import css from '../App/App.module.css';

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
   const [debouncedSearch, setDebouncedSearch] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleSearch = useDebouncedCallback((search: string) => { setDebouncedSearch(search) }, 300);

  const handleSearchCange = (search: string) => {
    setSearch(search);
    setPage(1);
    handleSearch(search);
  };

 
 const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['notes', page, debouncedSearch],
    queryFn: () => fetchNotes({
      page,
      perPage: 12,
      search: debouncedSearch,
    }),
    placeholderData: keepPreviousData
  }
  );

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchCange} />
       {data && data.total_pages > 1 && (
          <Paginaition
            currentPage={page}
            totalPages={data.total_pages}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} type='button' onClick={() => setModalIsOpen(true)}>Create +</button>
      </header>
       {isLoading && <Loader />}
       {isError && <ErrorMessage />}
      {isSuccess && data?.data?.length > 0 ? (
        <NoteList notes={data.data} />)
        : (
          <p>No notes found</p>
        )
      }
      {modalIsOpen && (
        <Modal onClose={() => setModalIsOpen(false)}>
          <NoteForm onClose={() => setModalIsOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

