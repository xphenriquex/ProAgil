using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public class ProAgilRepository : IProAgilRepository
    {
        private readonly ProAgilContext _context;

        public ProAgilRepository(ProAgilContext context)
        {
            _context = context;
            //_context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

         public void Update<T>(T entity) where T : class
        {
            _context.Update(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

         public async Task<bool> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync()) > 0;
        }

         public async Task<Evento[]> GetAllEventosAsync(bool includesPalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
                .Include(c => c.Lotes)
                .Include(c => c.RedeSociais);
            
            if(includesPalestrantes)
            {
              query = query
                .Include(pe => pe.PalestrantesEventos)
                .ThenInclude(p => p.Palestrante); 
            }

            query = query
                .AsNoTracking()
                .OrderBy(c => c.Id);

            return await query.ToArrayAsync();
        }


        public async Task<Evento> GetEventoAsyncById(int eventoId, bool includesPalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
                .Include(c => c.Lotes)
                .Include(c => c.RedeSociais);
            
            if(includesPalestrantes)
            {
              query = query
                .Include(pe => pe.PalestrantesEventos)
                .ThenInclude(p => p.Palestrante); 
            }

            query = query
                .AsNoTracking()
                .OrderBy(c => c.Id)
                .Where(c => c.Id == eventoId);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Evento[]> GetEventosAsyncByTema(string tema, bool includesPalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
                .Include(c => c.Lotes)
                .Include(c => c.RedeSociais);
            
            if(includesPalestrantes)
            {
              query = query
                .Include(pe => pe.PalestrantesEventos)
                .ThenInclude(p => p.Palestrante); 
            }

            query = query
                .AsNoTracking()
                .OrderByDescending(c => c.DataEvento)
                .Where(c => c.Tema.ToLower().Contains(tema.ToLower()));

            return await query.ToArrayAsync();
        }

        public async Task<Palestrante> GetPalestranteAsyncById(int palestranteId, bool includesEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                .Include(c => c.RedeSociais);
            
            if(includesEventos)
            {
              query = query
                .Include(pe => pe.PalestranteEventos)
                .ThenInclude(e => e.Evento); 
            }

            query = query
                .AsNoTracking()
                .OrderBy(p => p.Nome)
                .Where(p => p.Id == palestranteId);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Palestrante[]> GetPalestranteAsyncByName(string nome, bool includesEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                .Include(c => c.RedeSociais);
            
            if(includesEventos)
            {
              query = query
                .Include(pe => pe.PalestranteEventos)
                .ThenInclude(e => e.Evento); 
            }

            query = query
                .AsNoTracking()
                .OrderBy(p => p.Nome)
                .Where(p => p.Nome.ToLower().Contains(nome.ToLower()));

            return await query.ToArrayAsync();
        }

    }
}