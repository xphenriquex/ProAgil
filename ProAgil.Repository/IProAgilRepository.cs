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
        Task<Evento[]> GetEventosAsyncByTema(string tema, bool includesPalestrantes);
        Task<Evento[]> GetAllEventosAsync(bool includesPalestrantes = false);
        Task<Evento> GetEventoAsyncById(int eventoId, bool includesPalestrantes = false);

        //Palestrante
        Task<Palestrante[]> GetPalestranteAsyncByName(string nome, bool includesEventos = false);
        Task<Palestrante> GetPalestranteAsyncById(int palestranteId, bool includesEventos = false);
    }
}