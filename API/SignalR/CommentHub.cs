using Application.Activities.Commands;
using Application.Activities.DTOs;
using Application.Activities.Queries;
using Application.Core;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class CommentHub(IMediator mediator) : Hub
{
    public async Task SendComment(AddComment.Command command)
    {
        Result<CommentDto>? comment = await mediator.Send(command);
        await Clients.Group(command.ActivityId).SendAsync("ReceiveComment", comment.Value);
    }

    public override async Task OnConnectedAsync()
    {
        HttpContext? httpContext = Context.GetHttpContext();
        string? activityId = httpContext?.Request.Query["activityId"];

        if (string.IsNullOrEmpty(activityId))
        {
            throw new HubException("No activity with this id");
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, activityId);
        Result<List<CommentDto>> result = await mediator.Send(new GetComments.Query { ActivityId = activityId });
        await Clients.Caller.SendAsync("LoadComments", result.Value);
    }
}
