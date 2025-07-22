import ReactPaginate from "react-paginate";
import css from "../Pagination/Pagination.module.css";

interface PaginationProps{
    currentPage: number;
    totalPages: number;
    onPageChange: (selected: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    return (
        <ReactPaginate
            pageCount={totalPages}
            forcePage={currentPage - 1}
            onPageChange={(e) => onPageChange(e.selected + 1)}
            containerClassName={css.pagination}
            activeClassName={css.active}
        />
    );
};