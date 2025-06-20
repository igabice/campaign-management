import { format } from "date-fns"

export const formatDate = (date?: string) => {
    return date
        ? format(new Date(date), "MMM dd, yyyy HH:mm")
        : "";
}