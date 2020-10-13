
using Microsoft.EntityFrameworkCore;
using ProAgil.WebAPI.Model;

namespace ProAgil.WebAPI.Data
{
    public class DataContext : DbContext
    {
        public DbSet<Evento> Eventos { get; set; }
        
        public DataContext(DbContextOptions<DataContext> options) 
        : base(options){ }


    }
}