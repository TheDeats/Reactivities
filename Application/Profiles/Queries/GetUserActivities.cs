using Application.Core;
using Application.Profiles.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Queries;

public class GetUserActivities
{
    public class Query : IRequest<Result<List<UserActivityDto>>>
    {
        public required string Filter { get; set; }
        public required string UserId { get; set; }
    }

    public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, Result<List<UserActivityDto>>>
    {
        public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            IQueryable<Activity>? query = context.ActivityAttendees
                .Where( u => u.User.Id == request.UserId)
                .OrderBy(x => x.Activity.Date)
                .Select(x => x.Activity)
                .AsQueryable();

            query = request.Filter switch
            {
                "past" => query.Where(x => x.Date < DateTime.UtcNow),
                "hosting" => query.Where(x => x.Attendees.Any(a => a.IsHost && a.UserId == request.UserId)),
                _ => query.Where(x => x.Date >= DateTime.UtcNow),
            };

            IQueryable<UserActivityDto>? projectedActivities = query.ProjectTo<UserActivityDto>(mapper.ConfigurationProvider);
            List<UserActivityDto>? activities = await projectedActivities.ToListAsync(cancellationToken);
            return Result<List<UserActivityDto>>.Success(activities);
        }
    }
}
