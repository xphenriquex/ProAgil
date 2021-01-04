using System.Threading.Tasks;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public interface IProAgilRepository
    {
        //Geral
         void Add<T>(T entity) where T: class;
         void Update<T>(T entity) where T: class;
         void Delete<T>(T entity) where T: class;
        Task<bool> SaveChangesAsync();

        //Eventos
        Task<Evento[]> GetAllEventosAsyncByTema(string tema, bool includesPalestrantes);
        Task<Evento[]> GetAllEventosAsync(bool includesPalestrantes = false);
        Task<Evento> GetAllEventoAsyncById(int eventoId, bool includesPalestrantes = false);

        //Palestrante
        Task<Palestrante[]> GetAllPalestranteAsyncByName(string nome, bool includesEventos = false);
        Task<Palestrante> GetAllPalestranteAsyncById(int palestranteId, bool includesEventos = false);
    }
}