using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.Domain;
using ProAgil.Repository;
using ProAgil.WebAPI.Dtos;

namespace ProAgil.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventoController : ControllerBase
    {
        private readonly IProAgilRepository _repo;
        private readonly IMapper _mapper;

        public EventoController(IProAgilRepository repo, IMapper mapper)
        {
            _repo = repo;
            this._mapper = mapper;
        }

        public async Task<IActionResult> Get()
        {
            try
            {
                var eventos = await _repo.GetAllEventosAsync(true);
                var result = _mapper.Map<EventoDto[]>(eventos);
                return Ok(result);
            }
            catch (System.Exception)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }
        }

        [HttpGet("{eventId}")]
        public async Task<IActionResult> Get(int eventId)
        {
            try
            {
                var evento = await _repo.GetEventoAsyncById(eventId);
                var result = _mapper.Map<EventoDto>(evento);
                return Ok(result);
            }
            catch (System.Exception)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }
        }

        [HttpGet("getByTema/{tema}")]
        public async Task<IActionResult> Get(string tema)
        {
            try
            {
                var eventos = await _repo.GetEventosAsyncByTema(tema, true);
                var result = _mapper.Map<EventoDto[]>(eventos);
                return Ok(result);
            }
            catch (System.Exception)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(EventoDto model)
        {
            try
            {
                var evento = _mapper.Map<Evento>(model);
                _repo.Add(evento);

                if (await _repo.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}", _mapper.Map<EventoDto>(evento));
                }
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de dados falhou {ex}");
            }

            return BadRequest();
        }

        [HttpPut("{eventId}")]
        public async Task<IActionResult> Put(int eventId, EventoDto model)
        {
            try
            {
                var evento = await _repo.GetEventoAsyncById(eventId);
                if (evento == null) return NotFound();

                _mapper.Map(model, evento);
                _repo.Update(evento);

                if (await _repo.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}", _mapper.Map<EventoDto>(evento));
                }
            }
            catch (System.Exception)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }

            return BadRequest();
        }

        [HttpDelete("{eventId}")]
        public async Task<IActionResult> Delete(int eventId)
        {
            try
            {
                var evento = await _repo.GetEventoAsyncById(eventId);
                if (evento == null) return NotFound();

                _repo.Delete(evento);

                if (await _repo.SaveChangesAsync())
                {
                    return Ok();
                }
            }
            catch (System.Exception)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }

            return BadRequest();
        }
    }
}