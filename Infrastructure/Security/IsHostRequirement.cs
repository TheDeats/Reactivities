using System.Security.Claims;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security;

public class IsHostRequirement : IAuthorizationRequirement
{

}

public class IsHostRequirementHandler(AppDbContext dbContext, IHttpContextAccessor httpContextAccessor) : 
                AuthorizationHandler<IsHostRequirement>
{
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
    {
        string? userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return;
        HttpContext? httpContext = httpContextAccessor.HttpContext;

        // checks the following: 
        // we have http context
        // we have a root value of id
        // that the root value is a string
        // if any of this fails it returns a 403 forbidden error
        // if it passes its assigned to the activityId variable
        if (httpContext?.GetRouteValue("id") is not string activityId) return;

        // important that we don't track this otherwise entity framework will track this attendee and it will be added it to our activity from the db in the editActivityMethod
        // in the editActivityMethod we map our request activity to the activity from the db and the mapper update all the attendees as well
        // we only need the attendee to check if they are the host before we send Succeed
        ActivityAttendee? attendee = await dbContext.ActivityAttendees
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.UserId == userId && x.ActivityId == activityId);
        if (attendee == null) return;
        if (attendee.IsHost)
        {
            context.Succeed(requirement);
        }
    }
}